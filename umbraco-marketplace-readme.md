# BetterIcons

[![NuGet](https://img.shields.io/nuget/v/Umbraco.Community.BetterIcons.svg)](https://www.nuget.org/packages/Umbraco.Community.BetterIcons/)
[![NuGet Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.BetterIcons.svg)](https://www.nuget.org/packages/Umbraco.Community.BetterIcons/)
[![License](https://img.shields.io/github/license/niteshbabu/Umbraco.Community.BetterIcons.svg)](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/niteshbabu/Umbraco.Community.BetterIcons.svg)](https://github.com/niteshbabu/Umbraco.Community.BetterIcons/issues)

[![Umbraco Marketplace](https://img.shields.io/badge/umbraco-marketplace-blue.svg)](https://marketplace.umbraco.com/package/umbraco.community.bettericons)
[![Umbraco Version](https://img.shields.io/badge/umbraco-11.x%20|%2012.x%20|%2013.x%20|%2015.x%20|%2016.x%20|%2017.x-brightgreen.svg)](https://umbraco.com)
[![.NET Version](https://img.shields.io/badge/.NET-7.0%20|%208.0%20|%209.0%20|%2010.0-512BD4.svg)](https://dotnet.microsoft.com/)

![BetterIcons Demo](https://raw.githubusercontent.com/NiteshBabu/Umbraco.Community.BetterIcons/master/better-icons.gif)

BetterIcons is a modern property editor that provides access to **200,000+ icons** from popular icon libraries including Material Design Icons, Font Awesome, Bootstrap Icons, and 100+ more.

## ✨ Key Features

- 🎨 **200,000+ Icons** - Access to all major icon libraries
- 🎯 **Smart Search** - Find icons instantly across all collections
- 🌈 **Color Picker** - Customize icon colors directly in the editor
- ⚡ **Fast & Responsive** - Built with React for smooth performance
- 🔧 **Zero Configuration** - Works out of the box with easy Razor helpers
- 🛡️ **License Info in Modal** - See license details and warnings for each icon collection directly in the picker modal

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

| Umbraco Version | .NET Version | Package Version |
|----------------|--------------|------------------|
| 17.x           | .NET 10.0    | ≥ 1.1.0          |
| 16.x           | .NET 9.0     | ≥ 1.1.0          |
| 15.x           | .NET 9.0     | ≥ 1.1.0          |
| 13.x           | .NET 8.0     | ≥ 1.0.0          |
| 12.x           | .NET 7.0     | ≥ 1.1.0          |
| 11.x           | .NET 7.0     | ≥ 1.1.0          |

> **Note:** Umbraco 14.x is not currently supported due to breaking API changes. Support for this version is being worked on.

## 📚 Documentation

Full documentation: [GitHub Repository](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons)

## 💬 Support

- [Discussions](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/discussions)
- [Report Issues](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/issues)


## 📄 License & Compliance

BetterIcons now displays license information for each icon collection directly in the picker modal, helping users make informed and compliant choices. Users are warned about restricted or unknown licenses before selection.

MIT License - Free to use in commercial and personal projects.
