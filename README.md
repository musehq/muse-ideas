# muse-reality
A repo to store ideas that are pushed live to Muse. The ideas are organized by type and identified by the `idea.json` manifest file. Instructions to contribute coming soon...

## setup

- run `yarn install` to install all the packages
- run `yarn dev` to start a local development server

## scripts

- run `yarn sync` every time you make a new idea (identified by the idea.json) to automatically create the page in the `pages` folder
- run `yarn clean` to delete all `.idea` folders left over from locally building

## develop

Once your page is created, you can access the idea at the same path starting from `src/ideas`. For example, to develop the Proximity Media idea located at `src/ideas/decorations/ProximityMedia`, go to `localhost:3000/decorations/ProximityMedia` 
