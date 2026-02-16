using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using BetterIcons.Models;

namespace BetterIcons.Extensions
{
    /// <summary>
    /// Zero-config extension methods for BetterIcons in Razor templates
    /// </summary>
    public static class BetterIconsExtensions
    {
        /// <summary>
        /// Get BetterIcons icon value from any property alias
        /// Usage: var icon = Model.GetIconValue("iconpicker");
        /// </summary>
        public static BetterIconsValue GetIconValue(this IPublishedElement element, string propertyAlias)
        {
#if NET7_0 || NET8_0
            var value = element.Value<BetterIconsValue>(propertyAlias);
#else
            // Umbraco 14+: Use GetProperty then Value
            var property = element.GetProperty(propertyAlias);
            var value = property?.GetValue() as BetterIconsValue;
#endif
            return value ?? new BetterIconsValue();
        }

        /// <summary>
        /// Get and render BetterIcons icon in one call
        /// Usage: @Model.RenderIcon("iconpicker") or @Model.RenderIcon("iconpicker", size: 48)
        /// </summary>
        public static IHtmlContent RenderIcon(
            this IPublishedElement element,
            string propertyAlias,
            int size = 32,
            string cssClass = "")
        {
            var iconValue = element.GetIconValue(propertyAlias);
            return iconValue.Render(size, cssClass);
        }

        /// <summary>
        /// Render BetterIcons icon with custom inline style
        /// Usage: @Model.RenderIconWithStyle("iconpicker", "font-size: 64px; color: #ff0000;")
        /// </summary>
        public static IHtmlContent RenderIconWithStyle(
            this IPublishedElement element,
            string propertyAlias,
            string style)
        {
            var iconValue = element.GetIconValue(propertyAlias);
            return iconValue.RenderWithStyle(style);
        }
    }
}
