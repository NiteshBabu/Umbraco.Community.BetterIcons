using System;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Serialization;

namespace BetterIcons.PropertyEditors
{
#if NET7_0 || NET8_0
    /// <summary>
    /// BetterIcons property editor for Umbraco CMS 11-13
    /// </summary>
    [DataEditor(
        alias: "BetterIcons.Editor",
        name: "BetterIcons",
        view: "/App_Plugins/BetterIcons/index.html",
        Group = "Pickers",
        Icon = "icon-picture",
        ValueType = ValueTypes.Text)]
    public class BetterIconsDataEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        private readonly IConfigurationEditorJsonSerializer _configurationEditorJsonSerializer;

        public BetterIconsDataEditor(
            IDataValueEditorFactory dataValueEditorFactory,
            IIOHelper ioHelper,
            IConfigurationEditorJsonSerializer configurationEditorJsonSerializer,
            EditorType type = EditorType.PropertyValue)
            : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
            _configurationEditorJsonSerializer = configurationEditorJsonSerializer;
        }

        protected override IConfigurationEditor CreateConfigurationEditor()
        {
            return new BetterIconsConfigurationEditor(_ioHelper, _configurationEditorJsonSerializer);
        }
    }

    /// <summary>
    /// Configuration editor for BetterIcons - allows restricting which icon libraries are available
    /// </summary>
    public class BetterIconsConfigurationEditor : ConfigurationEditor
    {
        public BetterIconsConfigurationEditor(IIOHelper ioHelper, IConfigurationEditorJsonSerializer serializer)
            : base()
        {
            Fields.Add(new ConfigurationField
            {
                Key = "allowedCollections",
                Name = "Allowed Icon Libraries",
                Description = "Select which icon libraries should be available in the picker. If none are selected, all libraries will be shown.",
                View = "/App_Plugins/BetterIcons/views/allowedCollections.html"
            });
        }
    }
#else
    /// <summary>
    /// BetterIcons property editor for Umbraco CMS 17
    /// </summary>
    [DataEditor("BetterIcons.Editor", ValueType = ValueTypes.Text)]
    public class BetterIconsDataEditor : DataEditor
    {
        public BetterIconsDataEditor(IDataValueEditorFactory dataValueEditorFactory)
            : base(dataValueEditorFactory)
        {
        }
    }
#endif
}
