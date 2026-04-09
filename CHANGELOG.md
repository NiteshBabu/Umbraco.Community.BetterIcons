# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Icon Registration Dashboard** (Most Requested Feature) - Now register icons directly into Umbraco's icon picker for use as Document Type icons, Media Type icons, and throughout the backoffice
  - BetterIcons Management dashboard in Settings section
  - API endpoint for registering and deleting icons
  - Version-specific icon storage (SVG for U11-13, JS modules for U14+)
  - Icon naming convention: `bi-[collection]--[iconname]`
  - Support for 200,000+ icons across different collections
  - Bulk icon registration and deletion

### Planned
- Multi-icon selection support
- Custom icon upload capability
- Cofigurations
- Improved accessibility features
- Dark mode support

## [1.1.0] - 2026-02-16

### Added
- **Multi-version support**: Added compatibility with Umbraco 11.x, 12.x, 15.x, 16.x, and 17.x
- Support for .NET 7.0, .NET 9.0, and .NET 10.0 frameworks
- Multi-target framework compilation (net7.0, net8.0, net9.0, net10.0)
- Conditional package references for different Umbraco versions
- Demo pages for all supported Umbraco versions
- Consistent port configuration across test projects

### Changed
- Updated property editor implementation for Umbraco 16+ (removed EditorType parameter)

## [1.0.0] - 2026-02-10

### Added
- Initial release of BetterIcons for Umbraco
- Support for 200,000+ icons for Umbraco icons
- Real time icon search across 100+ icon collections
- Virtualized rendering for optimal performance
- Strongly typed C# models with JSON serialization
- Helper extension methods for easy frontend rendering
- Comprehensive documentation and quickstart guide
- React based property editor with AngularJS integration
- Icon preview in Umbraco backoffice
- Collection based organization with tabbed interface
- Responsive design with mobile support
- Built for Umbraco 13.x on .NET 8.0
- React UI with TypeScript and Rsbuild
- Virtual scrolling for large icon lists
- Optimized bundle size and lazy loading

### Known Limitations
- Umbraco 14.x is not currently supported due to breaking API changes (support in progress)

[Unreleased]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/releases/tag/v1.0.0
