# Development

## API (Rails Server)
This project was developed with the intention of using the
[BrowseEverything Rails Engine](https://github.com/samvera/browse-everything) as
 a RESTful API, and this React application as a client.

In order to deploy *BrowseEverything* locally for developing this app. in your
local environment, please ensure that you are using the following dependencies:

* Ruby 2.6.5 or later
* Bundler 2.1.4 or later

Then, please follow these steps:

1. Clone the repository
```bash
git clone -b 2.x-stable https://github.com/samvera/browse-everything.git
```

2. Install the Gem dependencies and generate the test app.
```bash
RAILS_VERSION=6.0.2 bundle install
RAILS_VERSION=6.0.2 bundle exec rake engine_cart:generate
cd .internal_test_app
```

3. Run the Rails server
```bash
bundle install
bundle rails server
```

The Rails API should now be accessible on http://localhost:3000/api-docs

## User Interface (React App.)
Please ensure that the following dependencies are installed on your local
environment for the React app:

* NodeJS 12.16.0 or the latest LTS Erbium release
* Yarn 1.21.1 or later

1. Clone the repository
```bash
git clone https://github.com/samvera-labs/browse-everything-redux-react.git
```

2. Install the package dependencies
```bash
yarn install
```

3. Run the static server
```bash
yarn start
```

The React app. should be accessible http://localhost:3001

At this point, the user interface should be able to communicate with the Rails
API.
