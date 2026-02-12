# BetterIcons

[![NuGet](https://img.shields.io/nuget/v/Umbraco.Community.BetterIcons.svg)](https://www.nuget.org/packages/Umbraco.Community.BetterIcons/)
[![NuGet Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.BetterIcons.svg)](https://www.nuget.org/packages/Umbraco.Community.BetterIcons/)
[![License](https://img.shields.io/github/license/niteshbabu/Umbraco.Community.BetterIcons.svg)](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/niteshbabu/Umbraco.Community.BetterIcons.svg)](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/issues)

[![Umbraco Marketplace](https://img.shields.io/badge/umbraco-marketplace-blue.svg)](https://marketplace.umbraco.com/)
[![Umbraco Version](https://img.shields.io/badge/umbraco-11.x%20%7C%2012.x%20%7C%2013.x-brightgreen.svg)](https://umbraco.com)
[![.NET Version](https://img.shields.io/badge/.NET-7.0%20%7C%208.0-512BD4.svg)](https://dotnet.microsoft.com/)

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

| Umbraco Version | .NET Version |
|----------------|---------------|
| 13.x           | .NET 8.0      |
| 12.x           | .NET 7.0      |
| 11.x           | .NET 7.0      |

## 📚 Documentation

Full documentation: [GitHub Repository](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons)

## 💬 Support

- [Discussions](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/discussions)
- [Report Issues](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/issues)

## 📄 License

MIT License - Free to use in commercial and personal projects.
