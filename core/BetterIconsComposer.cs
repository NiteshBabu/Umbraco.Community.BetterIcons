using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
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
            // Register data editor for all versions
            builder.DataEditors().Add<BetterIconsDataEditor>();

            // Register property value converter for all versions
            builder.PropertyValueConverters().Append<BetterIconsValueConverter>();
        }
    }
}
