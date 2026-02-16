using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using BetterIcons.PropertyEditors;
#if NET7_0
using BetterIcons.Manifests;
#endif

namespace BetterIcons
{
    /// <summary>
    /// Composer to register BetterIcons components with Umbraco
    /// </summary>
    public class BetterIconsComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
#if NET7_0
            // Umbraco 11-13: Register manifest filter
            builder.ManifestFilters().Append<BetterIconsManifestFilter>();
#endif
            // Register data editor for all versions
            builder.DataEditors().Add<BetterIconsDataEditor>();
            
            // Register property value converter for all versions
            builder.PropertyValueConverters().Append<BetterIconsValueConverter>();
        }
    }
}
