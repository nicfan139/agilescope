import React from 'react';
import RootElement from './gatsby-root-element';

export const wrapRootElement = ({ element }): React.ReactElement => (
	<RootElement>{element}</RootElement>
);
