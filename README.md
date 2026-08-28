## Dhangadhi Khabar — React Native News App

Nepali-language news app for [Dhangadhi Khabar](https://www.dhangadhikhabar.com),
built with React Native 0.74 and TypeScript. Android is the primary target.

- Breaking-news strip, featured hero and an infinite-scrolling latest feed on one home screen
- Slide-out sidebar with every news category and a Nepali/English edition switcher
- Full-text search, saved articles, light/dark themes and offline reading

### Requirements

- Node 18+
- JDK 17
- Android SDK with an emulator or a connected device

### Installing

1. Clone the repository
2. `cd react-native-news-app`
3. `npm install`

### Running

```bash
npm start              # Metro bundler
npm run android        # build and install the debug app
```

Useful checks:

```bash
npx tsc --noEmit       # type check
npm run lint           # eslint
npm test               # jest
```

## Architecture

```
src/
  api/          HTTP client, request types, offline-aware fetching
  components/   ArticleCard, BreakingStrip, CategoryChips, NewsFeed, StateViews…
  hooks/        usePagedNews — pagination shared by every feed screen
  navigators/   drawer (sidebar) + bottom tabs + per-tab stacks
  screens/      Home, Search, Saved, Category, Tag, ArticleDetail, list screens
  storage/      AsyncStorage wrappers for bookmarks and the response cache
  theme/        design tokens and the light/dark ThemeProvider
  utils/        Nepali relative-time formatting
```

A few conventions worth knowing before editing:

- **Theming.** Nothing hard-codes a colour. Components call `useTheme()` and build
  their `StyleSheet` inside a `useMemo` keyed on the theme, so a light/dark switch
  re-styles the tree without a reload. Tokens live in `src/theme/tokens.ts`.
- **Typography.** Devanagari needs more vertical room than Latin — line heights in
  `typography` are deliberately well above the usual 1.4× so matras and the
  shirorekha do not collide. Keep that in mind when adding text styles.
- **Pagination.** Feed screens use `usePagedNews`, which de-duplicates by article
  id when appending. The feed is ordered by descending id and new articles are
  published while a user reads, so pages genuinely do overlap.
- **Offline.** `requestWithCache` writes every cacheable response to AsyncStorage
  and serves the stored copy when the network fails, so a cold start on a bad
  connection shows the last known content instead of an error screen. `ApiError`
  carries an `offline` flag so screens can tell "no connection" from "server
  error".

## API

The app talks to the Symfony API at `https://www.dhangadhikhabar.com/api/`
(configured in `src/api/client.ts`).

| Endpoint | Purpose |
| --- | --- |
| `GET /home` | Everything the home screen needs in one request: `breaking`, `featured`, `latest`, `categories`. Optional `?sections=1,8` adds per-category blocks; `?breaking_days=N` widens the breaking window. |
| `GET /news` | Paginated feed. Filters: `page`, `per_page`, `category`, `tag`, `author`, `q`, `breaking`, `featured`, `date_from`, `date_to`. Responds with `page`, `has_more`, `total_pages`, `total_results`. |
| `GET /news/{id}` | Article detail with `content`, `categories`, `tags` and `related_news`. 404s on an unknown or unpublished id. |
| `GET /categories` | Nepali edition by default. `?edition=<id>` selects another edition, `?edition=all` returns every edition mixed. |
| `GET /editions` | Available site editions, used to build the sidebar's edition switcher. |
| `GET /tags` | Trending tags, used for search suggestions. |

`breaking` and `featured` are editorial flags set on tens of thousands of
historical articles, so `/home` bounds both by a recency window rather than by
the flag alone. Querying `/news?breaking=1` without a date filter returns the
entire archive of breaking stories, not just current ones.

The client degrades gracefully against an older API deployment: if `/home` or
`/editions` 404, it composes the home payload from the long-standing endpoints
and hides the edition switcher.

## Contributing

1. Fork it (<https://github.com/bhaktaraz/react-native-news-app/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
