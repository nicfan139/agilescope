import type { GatsbyConfig } from 'gatsby';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: `.env`
});

const config: GatsbyConfig = {
	trailingSlash: 'never',
	graphqlTypegen: true,
	plugins: [
		{
			resolve: '@chakra-ui/gatsby-plugin',
			options: {
				/**
				 * @property {boolean} [resetCSS=true]
				 * if false, this plugin will not use `<CSSReset />
				 */
				resetCSS: true,
				/**
				 * @property {boolean} [isUsingColorMode=true]
				 * if false, this plugin will not use <ColorModeProvider />
				 */
				isUsingColorMode: true,
				/**
				 * @property {boolean} [isBaseProvider=false]
				 * if true, will render `<ChakraBaseProvider>`
				 */
				isBaseProvider: false
			}
		},
		{
			resolve: `gatsby-plugin-alias-imports`,
			options: {
				alias: {
					'@/components': path.resolve(__dirname, 'src/components'),
					'@/constants': path.resolve(__dirname, 'src/constants'),
					'@/contexts': path.resolve(__dirname, 'src/contexts'),
					'@/forms': path.resolve(__dirname, 'src/forms'),
					'@/helpers': path.resolve(__dirname, 'src/helpers'),
					'@/hooks': path.resolve(__dirname, 'src/hooks'),
					'@/modals': path.resolve(__dirname, 'src/modals')
				},
				extensions: []
			}
		},
		{
			resolve: `gatsby-plugin-netlify`
		}
	]
};

export default config;
