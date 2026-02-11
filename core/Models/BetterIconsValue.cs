using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Html;

namespace BetterIcons.Models
{
    /// <summary>
    /// Model for BetterIcons icon data
    /// </summary>
    public class BetterIconsValue
    {
        private const string script = "https://code.iconify.design/3/3.1.0/iconify.min.js";

        [JsonProperty("icon")]
        public string Icon { get; set; } = string.Empty;

        [JsonProperty("color")]
        public string Color { get; set; } = "#000000";

        [JsonIgnore]
        public bool IsEmpty => string.IsNullOrWhiteSpace(Icon);

        /// <summary>
        /// Get debug info about the icon value
        /// </summary>
        [JsonIgnore]
        public string DebugInfo => $"Icon: '{Icon}', Color: '{Color}', IsEmpty: {IsEmpty}";

        /// <summary>
        /// Parse BetterIcons icon data from JSON string
        /// </summary>
        public static BetterIconsValue Parse(string? json)
        {
            if (string.IsNullOrWhiteSpace(json))
                return new BetterIconsValue();

            if (json.StartsWith("BetterIcons.Models.") || json.StartsWith("IconPicker.Models."))
            {
                return new BetterIconsValue();
            }

            try
            {
                var data = JObject.Parse(json);
                return new BetterIconsValue
                {
                    Icon = data["icon"]?.ToString() ?? string.Empty,
                    Color = data["color"]?.ToString() ?? "#000000"
                };
            }
            catch
            {
                return new BetterIconsValue();
            }
        }

        /// <summary>
        /// The script is injected only once per page using a marker
        /// Usage: @iconValue.Render()
        /// </summary>
        public IHtmlContent Render(int size = 32, string cssClass = "")
        {
            if (IsEmpty)
                return HtmlString.Empty;

            var classes = string.IsNullOrWhiteSpace(cssClass)
                ? "iconify"
                : $"iconify {cssClass}";

            var html = $@"<span class=""{classes}"" 
                  data-icon=""{Icon}"" 
                  style=""color: {Color}; font-size: {size}px;""></span>";

            return new HtmlString(html);
        }

        /// <summary>
        /// Render with inline style instead of size/color
        /// Usage: @iconValue.RenderWithStyle("font-size: 48px; color: red;")
        /// </summary>
        public IHtmlContent RenderWithStyle(string style)
        {
            if (IsEmpty)
                return HtmlString.Empty;

            var html = $@"<span class=""iconify"" 
                  data-icon=""{Icon}"" 
                  style=""{style}""></span>";

            return new HtmlString(html);
        }

        /// <summary>
        /// Get the Iconify CDN script tag
        /// Place this once in your layout or page
        /// Usage: @BetterIconsValue.GetScript()
        /// </summary>
        public static IHtmlContent GetScript()
        {
            return new HtmlString($@"<script src=""{script}""></script>");
        }
    }
}
