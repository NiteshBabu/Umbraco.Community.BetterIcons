using System;
using BetterIcons.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Extensions;

namespace BetterIcons.PropertyEditors
{
    /// <summary>
    /// Value converter for BetterIcons property editor
    /// Converts stored JSON to BetterIconsValue model
    /// </summary>
    public class BetterIconsValueConverter : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType)
            => propertyType.EditorAlias.Equals("BetterIcons.Editor");

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof(BetterIconsValue);

        public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
        {
            if (source == null)
                return null;

            return source.ToString();
        }

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            if (inter == null)
                return new BetterIconsValue();

            return BetterIconsValue.Parse(inter.ToString());
        }
    }
}
