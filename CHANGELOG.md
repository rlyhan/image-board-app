## [1.15.1] - 2026-06-04
### Fixed
- Auth login/logout links use plain anchors to avoid Next.js RSC prefetch CORS errors

## [1.15.0] - 2026-06-03
### Changed
- Migrate cart and favourites state from React Context to Zustand
### Fixed
- Toast lifecycle bug where the remove timer was cancelled by effect cleanup as soon as the exit animation started, causing toasts to accumulate and never disappear

## [1.14.0] - 2026-06-01
### Changed
- Cart page restyle
- Cart products clickable for modal
### Fixed
- Nav and main element semantics

## [1.13.0] - 2026-06-01
### Added
- Dashboard favourites count
### Changed
- Dashboard profile card style

## [1.12.1] - 2026-06-01
### Fixed
- Remove gallery hover state after modal closed
- Correct gallery image selector for e2e test 

## [1.12.0] - 2026-05-31
### Changed
- Smoother looking searchbar with transitions on interaction
- Search on type
- Transitions in between search queries
### Fixed
- Seed Auth0 user from server to avoid redundant profile request on page load
- Gallery and search bar accessibility

## [1.11.0] - 2026-05-29
### Changed
- Gallery image hover reveals full aspect ratio via animated clip-path frame
- Image fade-in on gallery load
- Loading... text -> Loading spinner
- Extract hover capability detection into reusable `useHoverCapable` hook via `useSyncExternalStore`
- Stabilise gallery card compositor layers with `will-change` and `isolation`; defer load-more renders with `startTransition`; priority preload first 4 images
- Expand priority preload to first 8 images for better LCP coverage; modal uses `large2x` source with high-priority loading
### Fixed
- Deduplicate photos on load more

## [1.10.0] - 2026-05-25
### Added
- Gallery image lightbox modal
- Add to cart toast and button tick on add
### Fixed
- setState in modal effect via mount/unmount
- Add-to-cart as first button in gallery card
- Nav responsiveness
- Search bar accessibility

## [1.9.0] - 2026-05-24
### Added
- Favicon and metadata
- Nav logo and mobile login logo
### Changed
- Grid image sizing/layout optimised for mobile
- Favourite button replaced with heart
### Fixed
- Next image types in global.d.ts for CI typecheck

## [1.8.0] - 2026-05-21
### Fixed
- Drop baseURL to resolve against origin

## [1.7.0] - 2026-05-20
### Added
- Authentication required for checkout routes
- Server-side order validation
- Cypress tests handle Auth0
### Changed
- Update README
- Fold isHydrated into cart reducer to eliminate setState-in-effect
### Fixed
- Mock tokenization replacing raw card detail submission
- Payment form flash between submission and success redirect
- Require hydrated cart for checkout steps, customer details before payment
- Call onSuccess in event handler, not render body
- Correct Auth0 secret variable name
- Update Auth0 client secret in CI
- Fetch initial photos from server, not client
- Eslint disables for cypress
- Cypress env vars before steps

## [1.6.0] - 2026-03-09
### Added
- AGENTS.md

## [1.5.0] - 2026-03-03
### Added
- Payment route call before order route call
### Fixed
- Redirection if customer details missing during payment stage

## [1.4.0] - 2026-03-03
### Added
- Checkout payment/order flow
- Order success page

## [1.3.0] - 2026-02-19
### Added
- Checkout payment page

## [1.2.0] - 2026-02-19
### Added
- Checkout customer page

## [1.1.0] - 2026-02-19
### Added
- Add to cart functionality

## [1.0.0] - 2026-01-07
### Added
- Profile info update form
- Modal component
### Changed
- Client/server architecture in lib
- Separate MongoDB collections from server logic

## [0.10] - 2026-01-06
### Added
- CI/CD pipeline
- Profile Patch type
### Fixed
- Eliminate 'any' types

## [0.9] - 2026-01-05
### Added
- Profile create/edit API routes
- Vitest framework

## [0.8.6] - 2025-11-24
### Fixed
- CORS for Pexels call

## [0.8.5] - 2025-11-24
### Fixed
- Use NEXT_PUBLIC_BASE_URL as primary fetch base url for Pexels

## [0.8.4] - 2025-11-24
### Fixed
- Use correct environment variable for base url
- Use correct Auth0 base url environment variable name
- Remove NEXT_PUBLIC_BASE_URL from Pexels API call
### Changed
- Image and link optimisations for Next.js
- Eliminate 'any' types
- Add Google to allowed image hosts
- Hook optimisations

## [0.8.3] - 2025-11-24
### Fixed
- Remove favourite button not showing on favourited items

## [0.8.2] - 2025-11-24
### Changed
- Container component additional classes
- Gallery grid responsiveness
### Fixed
- Dashboard layout shift

## [0.8.1] - 2025-11-23
### Fixed
- Stop calling to favourites without authentication

## [0.8.0] - 2025-11-17
### Added
- MongoDB configuration
- Add to favourites functionality
- Button components
### Changed
- Refactor Pexels API route
- Refactor components

## [0.7.0] - 2025-11-12
### Added
- Dashboard page

## [0.6.0] - 2025-11-11
### Added
- Add Auth0
### Changed
- Downgrade Next.js to 15.1.6 to accomodate Next.js Auth0 package

## [0.5.0] - 2025-11-10
### Added
- Search functionality

## [0.4.0] - 2025-11-10
### Changed
- Masonry style for gallery

## [0.3.0] - 2025-11-10
### Added
- Lazy load Pexels images

## [0.2.0] - 2025-11-10
### Added
- Pull in data from Pexels

## [0.1.0] - 2025-11-7
### Added
- Initial project setup