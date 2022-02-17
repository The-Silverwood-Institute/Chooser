# Meal Chooser

Tag based meal search, to help decide what to cook for dinner.

The plan is to eventually incorporate this project into [Reciba.se](https://github.com/The-Silverwood-Institute/Recibase), once it hosts all of our recipes.

To output the list of meals use:
```js
meals.map(meal => meal.name).join("\n")
```

## Local setup

1. Fork + clone the project (consider using [GitHub Desktop](https://desktop.github.com/) if you're unfamiliar with git)
2. Open a terminal in the project directory
3. Serve the directory as a website using:
  - `python3 -m http.server` if you have Python installed
  - `ruby -run -ehttpd . -p8000` if you have Ruby installed
  - Any of [these other methods](https://gist.github.com/willurd/5720255)

## Contributing

Contributions are always welcome. This could mean requesting features, reporting bugs or creating pull requests.

If you don't have or want a GitHub account you could drop me a line via Twitter ([@kittsville](https://twitter.com/kittsville)) or email (kittsville@gmail.com).

Please bear in mind there is a [Code of Conduct](CODE_OF_CONDUCT.md) which defines acceptable behavior.
