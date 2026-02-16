#if NET7_0
using System.Collections.Generic;
using Umbraco.Cms.Core.Manifest;

namespace BetterIcons.Manifests
{
    /// <summary>
    /// Registers BetterIcons JavaScript for Umbraco 11-13
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
#endif
