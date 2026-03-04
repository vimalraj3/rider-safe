# Contributing to RiderSafe

First off, thank you for considering contributing to RiderSafe! It's people like you that make RiderSafe such a great tool.

## Where do I go from here?

If you've noticed a bug or have a question, [search the issue tracker](#) to see if someone else possesses already created a ticket. If not, go ahead and make one!

## Fork & create a branch

If this is something you think you can fix, then [fork RiderSafe](#) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-dark-mode
```

## Get the test suite running

Make sure you have Node.js and `pnpm` installed.

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. Copy `.env.example` to `.env` and fill in your database details
4. Run `npx prisma db push` to push the schema to your local dev database
5. Run `pnpm run dev` to start the development server

## Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with RiderSafe's master branch:

```sh
git remote add upstream [URL_TO_UPSTREAM_REPO]
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-dark-mode
git rebase master
git push --set-upstream origin 325-add-dark-mode
```

Finally, go to GitHub and make a Pull Request.

## Code Style

Our code is formatted using Prettier and linted with ESLint. Please ensure your code conforms to the project's style by running `pnpm run lint` before submitting a PR.
