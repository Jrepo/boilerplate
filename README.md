# Website Boilerplates

## Requirements
- Node v20
- Gulp v4
- Gem sass-lint

## Installation
```bash
sudo gem install scss_lint
npm install
```

## Usage/Commands
```bash
gulp setup
```
It is recommended to run the setup command when first starting the project. It will ask for the website name and stack. Currently only flat HTML and PHP are supported. It will modify the config.json file based on the input given and create a commonly used folder structure.

```bash
gulp buildJS
```
Will uglify the javascript files found in ```src/js``` and copy them to the ```dist``` folder. If concatJS is set to true in the config file, all the javascript files will be concatenated into a single file. Otherwise the file structure is retained.

```bash
gulp buildSCSS
```
Will compile the sass files found in ```src/scss``` and copy them to the ```dist``` folder.

```bash
gulp buildImages
```
Will copy the images found in ```src/imgs``` into the ```dist``` folder. If minifyImgs is set to true in the config file the images will be compressed.

```bash
gulp buildMisc
```
Will copy the files found in ```src/misc``` into the ```dist``` folder without modifications and while maintaining the file structure.

```bash
gulp buildFonts
```
Will copy the files found in ```src/fonts``` into the ```dist``` folder without modifications and while maintaining the file structure.

```bash
gulp build
```
Deletes the existing ```dist``` folder and runs all build commands above. It will also process either the HTML or PHP files found based on the extension in the config file. 


```bash
gulp serve
```
Run the build process, and all of the build processes and runs the site locally


```bash
gulp package
```
Run the build process and creates a zip of the ```dist``` folder using the website name and version number in the config file.  


## Cache-Busting
This build utilizes cache-busting to avoid the need for users to clear their cache after a launch. This relies on path variables set in the gulp file which are:
_CSS
_JS
_IMGS
Example usage: 
<!--
    <script type="text/javascript" src="_JS/main.js"></script>
-->
This will generate a version folder for the images, css, and js, based on the version set in package.json. To utilize this, please update the version in package.json for each launch and use the path variables above when adding new assets. The 'gulp build' task will take care of the rest.








