using Umbraco.Cms.Core.Manifest;

namespace BetterIcons.Manifests
{
    /// <summary>
    /// Registers BetterIcons JavaScript
    /// </summary>
    public class BetterIconsManifestFilter : IManifestFilter
    {
        public void Filter(List<PackageManifest> manifests)
        {
            manifests.Add(new PackageManifest
            {
                PackageName = "BetterIcons",
                Scripts = new[]
                {
                    "/App_Plugins/BetterIcons/js/index.js"
                }
            });
        }
    }
}
