module.exports = {
  syntax: "postcss-scss",
  map: false,
  plugins: [


    /* fix flex bugs : cf https://github.com/philipwalton/flexbugs */
    require('postcss-flexbugs-fixes')({ bug6: false }),

    /*
		* Combine same media queries into one
		* https://github.com/solversgroup/postcss-sort-media-queries
		*/
    require('postcss-sort-media-queries')({
      sort: 'mobile-first',
      configuration: {
        unitlessMqAlwaysFirst: true,
      }
    }),

    /*
		* Adds vendor prefixes to css attributes
		* https://github.com/postcss/autoprefixer
		*/
    require('autoprefixer'),

    require('cssnano')({
      preset: require('cssnano-preset-default'),
    }),
    /*
		* Remove unused CSS
		*/
    // require('postcss-purgecss')({
    //   content: ['./!**!/!*.html']
    // })
  ]
};