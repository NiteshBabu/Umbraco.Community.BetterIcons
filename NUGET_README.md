# BetterIcons for Umbraco

[![NuGet](https://img.shields.io/nuget/v/Umbraco.Community.BetterIcons.svg)](https://www.nuget.org/packages/Umbraco.Community.BetterIcons/)
[![NuGet Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.BetterIcons.svg)](https://www.nuget.org/packages/Umbraco.Community.BetterIcons/)
[![License](https://img.shields.io/github/license/niteshbabu/Umbraco.Community.BetterIcons.svg)](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/niteshbabu/Umbraco.Community.BetterIcons.svg)](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/issues)

[![Umbraco Marketplace](https://img.shields.io/badge/umbraco-marketplace-blue.svg)](https://marketplace.umbraco.com/)
[![Umbraco Version](https://img.shields.io/badge/umbraco-12.x%20%7C%2013.x-brightgreen.svg)](https://umbraco.com)
[![.NET Version](https://img.shields.io/badge/.NET-7.0%20%7C%208.0-512BD4.svg)](https://dotnet.microsoft.com/)

**BetterIcons is a modern property editor for Umbraco CMS that provides access to 200,000+ icons from popular icon libraries.**

![BetterIcons Demo](https://raw.githubusercontent.com/NiteshBabu/Umbraco.Community.BetterIcons/master/better-icons.gif)

## ✨ Features

- 🎨 **200,000+ Icons** - Material Design Icons, Font Awesome, Bootstrap Icons, Heroicons, and 100+ more
- 🎯 **Smart Search** - Fast search across all collections with real-time results
- 🌈 **Color Picker** - Built-in color customization for each icon
- ⚡ **Performance Optimized** - Virtualized rendering for smooth scrolling
- 🔧 **Zero Configuration** - Works out of the box, static assets bundled with DLL
- 📱 **Responsive UI** - Modern, touch-friendly interface

## 🚀 Quick Start

### 1. Add Property to Document Type

In Umbraco backoffice:
1. Go to **Settings > Document Types**
2. Add a new property
3. Select **BetterIcons** as the property editor
4. Save

### 2. Use in Templates

```cshtml
@using BetterIcons.Extensions
@using BetterIcons.Models

@* Add Iconify script once in your layout *@
@BetterIconsValue.GetScript()

@* Render icon with default size *@
@Model.RenderIcon("iconPropertyAlias")

@* Render with custom size *@
@Model.RenderIcon("iconPropertyAlias", size: 48)

@* Render with custom size and CSS class *@
@Model.RenderIcon("iconPropertyAlias", size: 64, cssClass: "my-icon")
```

### Advanced Usage

```cshtml
@{
    var icon = Model.GetIconValue("iconPropertyAlias");
}

@if (!icon.IsEmpty)
{
    @* Render with inline styles *@
    @Model.RenderIconWithStyle("iconPropertyAlias", "font-size: 64px;")
    
    @* Or use the icon value directly *@
    @icon.Render(size: 32)
    
    @* Access properties *@
    <p>Icon: @icon.Icon</p>
    <p>Color: @icon.Color</p>
}
```

## 🎨 Popular Icon Collections

- **Material Design Icons** (7,000+ icons)
- **Font Awesome** (2,000+ icons)
- **Bootstrap Icons** (2,000+ icons)
- **Heroicons** (300+ icons)
- **Feather** (280+ icons)
- **Lucide** (1,400+ icons)
- **Tabler Icons** (4,800+ icons)
- **Phosphor** (9,000+ icons)
- ...and 100+ more with 200,000+ total icons!

## 🎯 Compatibility

| Umbraco Version | .NET Version | Package Version |
|----------------|--------------|-----------------|
| 13.x           | .NET 8.0     | 1.x             |
| 12.x           | .NET 7.0     | 1.x             |

## 💾 Data Storage

Icon values are stored as: `collection:iconName|colorHex`

Example: `mdi:home|#3544b1`

The extension methods automatically handle this format for you.

## 🐛 Troubleshooting

### Icons Not Displaying?

Make sure to include the Iconify script:

```cshtml
@BetterIconsValue.GetScript()
```

### Property Editor Not Appearing?

1. Restart your Umbraco application
2. Clear browser cache
3. Verify installation: `dotnet list package | grep BetterIcons`

## 📚 Documentation

Full documentation and examples: [GitHub Repository](https://github.com/niteshbabu/Umbraco.Community.BetterIcons)

## 💬 Support & Feedback

- **Report Issues:** [GitHub Issues](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/issues)
- **Discussions:** [GitHub Discussions](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/discussions)
- **Marketplace:** [Umbraco Marketplace](https://marketplace.umbraco.com/)

## 📄 License

MIT License - Free for commercial and personal use.

---

**Made with ❤️ for the Umbraco Community**

If you find this package useful, please ⭐ star the repository!
