# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Custom icon upload capability
- Improved accessibility features
- Dark mode support

## [1.3.0] - 2026-05-14

### Added
- **Allowed Icon Libraries configuration** ([#4](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/issues/4)) - Restrict which icon libraries are available per data type instance
  - Multiselect checkbox list on data type configuration
  - When no libraries are selected, all 22 collections are shown (backwards compatible)
  - Filtered collections apply to both the tab list and "Search in all" functionality

## [1.2.2] - 2026-04-13

### Fixed
- Include license info on grouped tab view
- Minor UI fixes in icon modal

## [1.2.1] - 2026-04-09

### Added
- **Icon Registration Dashboard** ([#2](https://github.com/NiteshBabu/Umbraco.Community.BetterIcons/pull/2)) - Register icons directly into Umbraco's icon picker for use as Document Type icons, Media Type icons, and throughout the backoffice
  - BetterIcons Management dashboard in Settings section
  - API endpoint for registering and deleting icons
  - Version-specific icon storage (SVG for U11-13, JS modules for U14+)
  - Icon naming convention: `bi-[collection]--[iconname]`
  - Support for 200,000+ icons across different collections
  - Bulk icon registration and deletion

### Fixed
- Umbraco Marketplace readme filename to match package ID syntax
- Missing ID in create_release step in CI workflow

## [1.1.1] - 2026-02-18

### Added
- **License Info component** - Show icon pack licences while browsing and selecting icons
- Updated documentation and licensing info

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

[Unreleased]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.1.1...v1.2.1
[1.1.1]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/niteshbabu/Umbraco.Community.BetterIcons/releases/tag/v1.0.0
