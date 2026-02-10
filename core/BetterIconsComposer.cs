using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using BetterIcons.Manifests;
using BetterIcons.PropertyEditors;

namespace BetterIcons
{
    /// <summary>
    /// Composer to register BetterIcons components with Umbraco
    /// </summary>
    public class BetterIconsComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.ManifestFilters().Append<BetterIconsManifestFilter>();
            
            builder.PropertyValueConverters().Append<BetterIconsValueConverter>();
        }
    }
}
