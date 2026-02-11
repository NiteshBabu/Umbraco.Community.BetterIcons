# BetterIcons

![BetterIcons Demo](https://raw.githubusercontent.com/NiteshBabu/Umbraco.Community.BetterIcons/master/better-icons.gif)

BetterIcons is a modern property editor that provides access to **200,000+ icons** from popular icon libraries including Material Design Icons, Font Awesome, Bootstrap Icons, and 100+ more.

## ✨ Key Features

- 🎨 **200,000+ Icons** - Access to all major icon libraries
- 🎯 **Smart Search** - Find icons instantly across all collections
- 🌈 **Color Picker** - Customize icon colors directly in the editor
- ⚡ **Fast & Responsive** - Built with React for smooth performance
- 🔧 **Zero Configuration** - Works out of the box with easy Razor helpers

## 📦 Installation

```bash
dotnet add package Umbraco.Community.BetterIcons
```

## 🚀 Quick Start

### 1. Add Property to Document Type

Go to **Settings > Document Types** and add a new property with **BetterIcons** as the property editor.

### 2. Use in Templates

```cshtml
@using BetterIcons.Extensions
@using BetterIcons.Models

@* Add script once in your layout *@
@BetterIconsValue.GetScript()

@* Render icon *@
@Model.RenderIcon("iconPropertyAlias")

@* Render with custom size *@
@Model.RenderIcon("iconPropertyAlias", size: 48)
```

## 🎯 Compatibility

- **Umbraco:** 13.x
- **.NET:** 8.0

## 📚 Documentation

Full documentation: [GitHub Repository](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons)

## 💬 Support

- [Discussions](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/discussions)
- [Report Issues](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/issues)

## 📄 License

MIT License - Free to use in commercial and personal projects.
