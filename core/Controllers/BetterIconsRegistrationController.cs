using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.RegularExpressions;

#if NET7_0 || NET8_0
using Microsoft.AspNetCore.Hosting;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Web.BackOffice.Controllers;
#else
using Microsoft.AspNetCore.Hosting;
#endif

namespace BetterIcons.Controllers
{
  /// <summary>
  /// API Controller for registering icons from BetterIcons to Umbraco's icon system
  /// </summary>
#if NET7_0 || NET8_0
  [Route("umbraco/backoffice/api/bettericons")]
  public class BetterIconsRegistrationController : UmbracoApiController
#else
  [ApiController]
  [Route("umbraco/backoffice/api/bettericons")]
  public class BetterIconsRegistrationController : ControllerBase
#endif
  {
    private readonly IWebHostEnvironment _env;
    private static readonly HttpClient _httpClient = new HttpClient();

    public BetterIconsRegistrationController(IWebHostEnvironment env)
    {
      _env = env;
    }

    /// <summary>
    /// Register selected icons to Umbraco's icon folder
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> RegisterIcons([FromBody] RegisterIconsRequest request)
    {
      try
      {
        if (request?.Icons == null || !request.Icons.Any())
        {
          return BadRequest(new { error = "No icons provided" });
        }

#if NET7_0 || NET8_0
        // For Umbraco 11-13: Save SVG files to backoffice/icons folder
        var iconPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "backoffice", "icons");
        Directory.CreateDirectory(iconPath);
#else
        // For Umbraco 14+: Create JS icon modules
        var iconModulesPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "registered-icons");
        Directory.CreateDirectory(iconModulesPath);
#endif

        var registered = new List<string>();
        var failed = new List<string>();
        var iconManifestEntries = new List<object>();

        foreach (var iconName in request.Icons)
        {
          if (string.IsNullOrWhiteSpace(iconName) || !iconName.Contains(':'))
          {
            failed.Add(iconName);
            continue;
          }

          try
          {
            // Fetch SVG from Iconify API
            var svg = await FetchIconSvgFromIconify(iconName);

            if (string.IsNullOrEmpty(svg))
            {
              failed.Add(iconName);
              continue;
            }

            // Clean and optimize SVG
            svg = CleanSvg(svg);

            // Generate filename
            var iconAlias = GenerateIconAlias(iconName);

#if NET7_0 || NET8_0
            // Umbraco 11-13: Save as SVG file to backoffice/icons folder
            var svgFileName = $"{iconAlias}.svg";
            var svgFilePath = Path.Combine(iconPath, svgFileName);
            await System.IO.File.WriteAllTextAsync(svgFilePath, svg);
#else
            // Umbraco 14+: ONLY save as JS module (index.js will be generated later)
            var jsFileName = $"{iconAlias}.js";
            var jsFilePath = Path.Combine(iconModulesPath, jsFileName);
            var jsContent = $"export default `{svg.Replace("`", "\\`")}`;";
            await System.IO.File.WriteAllTextAsync(jsFilePath, jsContent);
#endif

            registered.Add(iconAlias);
          }
          catch (Exception ex)
          {
            failed.Add(iconName);
            Console.WriteLine($"Failed to register {iconName}: {ex.Message}");
          }
        }

#if !NET7_0 && !NET8_0
        // Create icons index.js for Umbraco 14+
        // Scan ALL existing icon JS files and create complete manifest
        var indexJsPath = Path.Combine(iconModulesPath, "index.js");
        var indexJsPattern = "bi-*.js";
        var allIconFiles = Directory.Exists(iconModulesPath)
            ? Directory.GetFiles(iconModulesPath, indexJsPattern)
                .Select(f => Path.GetFileNameWithoutExtension(f))
                .Where(name => !string.IsNullOrEmpty(name))
                .OrderBy(name => name)
                .ToList()
            : new List<string>();

        if (allIconFiles.Count > 0)
        {
          var indexJsContent = "export default [\n" +
              string.Join(",\n", allIconFiles.Select(iconName =>
                  $"  {{ name: \"{iconName}\", path: () => import(\"./{iconName}.js\") }}")) +
              "\n];";
          await System.IO.File.WriteAllTextAsync(indexJsPath, indexJsContent);
        }
#endif

        return Ok(new
        {
          success = true,
          registered = registered.Count,
          failed = failed.Count,
          registeredIcons = registered,
          failedIcons = failed,
          message = "Icons registered successfully. Please restart your Umbraco application or recycle the app pool for the icons to appear in the icon picker."
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { error = ex.Message });
      }
    }

    /// <summary>
    /// Get list of currently registered BetterIcons
    /// </summary>
    [HttpGet("registered")]
    public IActionResult GetRegisteredIcons()
    {
      try
      {
        var iconsList = new HashSet<string>();

#if NET7_0 || NET8_0
        // Umbraco 11-13: Icons stored in backoffice/icons folder
        var iconPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "backoffice", "icons");
        
        if (Directory.Exists(iconPath))
        {
          // Look for SVG files with bi- prefix
          var icons = Directory.GetFiles(iconPath, "bi-*.svg")
              .Select(f => Path.GetFileNameWithoutExtension(f))
              .Where(name => !string.IsNullOrEmpty(name));
          foreach (var icon in icons)
          {
            iconsList.Add(icon);
          }
        }
#else
        // Umbraco 14+: Icons stored in App_Plugins/BetterIcons/registered-icons
        var iconModulesPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "registered-icons");
        
        if (Directory.Exists(iconModulesPath))
        {
          // Look for JS files
          var icons = Directory.GetFiles(iconModulesPath, "bi-*.js")
              .Select(f => Path.GetFileNameWithoutExtension(f))
              .Where(name => !string.IsNullOrEmpty(name) && name != "index");
          foreach (var icon in icons)
          {
            iconsList.Add(icon);
          }
        }
#endif

        return Ok(new { icons = iconsList.OrderBy(i => i).ToList() });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { error = ex.Message });
      }
    }

    /// <summary>
    /// Delete multiple registered icons
    /// </summary>
    [HttpPost("delete")]
    public IActionResult DeleteIcons([FromBody] DeleteIconsRequest request)
    {
      try
      {
        if (request?.IconAliases == null || !request.IconAliases.Any())
        {
          return BadRequest(new { error = "No icons provided" });
        }

        var deleted = new List<string>();
        var failed = new List<string>();

        foreach (var iconAlias in request.IconAliases)
        {
          if (string.IsNullOrWhiteSpace(iconAlias) || !iconAlias.StartsWith("bi-"))
          {
            failed.Add(iconAlias);
            continue;
          }

          try
          {
            var deletedAny = false;

#if NET7_0 || NET8_0
            // Delete SVG file from backoffice/icons folder (Umbraco 11-13)
            var iconPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "backoffice", "icons");
            var svgFilePath = Path.Combine(iconPath, $"{iconAlias}.svg");
            if (System.IO.File.Exists(svgFilePath))
            {
              System.IO.File.Delete(svgFilePath);
              deletedAny = true;
            }
#else
            // Delete JS module (Umbraco 14+)
            var iconModulesPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "registered-icons");
            var jsFilePath = Path.Combine(iconModulesPath, $"{iconAlias}.js");
            if (System.IO.File.Exists(jsFilePath))
            {
              System.IO.File.Delete(jsFilePath);
              deletedAny = true;
            }
#endif

            if (deletedAny)
            {
              deleted.Add(iconAlias);
            }
            else
            {
              failed.Add(iconAlias);
            }
          }
          catch (Exception ex)
          {
            failed.Add(iconAlias);
            Console.WriteLine($"Failed to delete {iconAlias}: {ex.Message}");
          }
        }

        // Regenerate icon manifest after deletion (Umbraco 14+ only)
#if !NET7_0 && !NET8_0
        if (deleted.Count > 0)
        {
          var iconModulesPath = Path.Combine(_env.WebRootPath, "App_Plugins", "BetterIcons", "registered-icons");

          // For Umbraco 14+: Regenerate index.js
          var indexJsPath = Path.Combine(iconModulesPath, "index.js");

          var allIconFiles = Directory.Exists(iconModulesPath)
              ? Directory.GetFiles(iconModulesPath, "bi-*.js")
                  .Select(f => Path.GetFileNameWithoutExtension(f))
                  .Where(name => !string.IsNullOrEmpty(name))
                  .OrderBy(name => name)
                  .ToList()
              : new List<string>();

          if (allIconFiles.Count > 0)
          {
            var indexJsContent = "export default [\n" +
                string.Join(",\n", allIconFiles.Select(iconName =>
                    $"  {{ name: \"{iconName}\", path: () => import(\"./{iconName}.js\") }}")) +
                "\n];";
            System.IO.File.WriteAllText(indexJsPath, indexJsContent);
          }
          else if (System.IO.File.Exists(indexJsPath))
          {
            // Delete index.js if no icons remain
            System.IO.File.Delete(indexJsPath);
          }
        }
#endif

        return Ok(new
        {
          success = true,
          deleted = deleted.Count,
          failed = failed.Count,
          deletedIcons = deleted,
          failedIcons = failed,
          message = $"Successfully deleted {deleted.Count} icon(s). Please restart your Umbraco application for changes to take effect."
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { error = ex.Message });
      }
    }

    private async Task<string> FetchIconSvgFromIconify(string iconName)
    {
      // Iconify API endpoint
      var url = $"https://api.iconify.design/{iconName}.svg?color=currentColor&height=50";

      var response = await _httpClient.GetAsync(url);

      if (!response.IsSuccessStatusCode)
      {
        return string.Empty;
      }

      return await response.Content.ReadAsStringAsync();
    }

    private string CleanSvg(string svg)
    {
      // Remove XML declaration if present
      svg = Regex.Replace(svg, @"<\?xml[^>]+\?>", "");

      // Remove comments
      svg = Regex.Replace(svg, @"<!--.*?-->", "", RegexOptions.Singleline);

      // Trim whitespace
      svg = svg.Trim();

      return svg;
    }

    private string GenerateIconAlias(string iconName)
    {
      var sanitized = iconName.Replace(":", "--");
      return $"bi-{sanitized}";
    }
  }

  public class RegisterIconsRequest
  {
    public List<string> Icons { get; set; } = new();
  }

  public class DeleteIconsRequest
  {
    public List<string> IconAliases { get; set; } = new();
  }
}
