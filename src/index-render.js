import React from "react";
import ReactDomServer from "react-dom/server";
import {ServerStyleSheet, StyleSheetManager} from 'styled-components'
import sanitizeHtml from 'sanitize-html';
import { template } from 'lodash';

const htmlSanitizeOptions = {
  allowedAttributes: {
    '*': ['class']
  }
};

const styleSanitizeOptions = {
  allowedTags: ['style'],
  allowedAttributes: {
    'style': ['type']
  },
  transformTags: {
    'style': tagName => ({
      tagName: tagName,
      attribs: {
        type: 'text/css'
      }
    })
  }
};

const render = (Component) => {
  const sheet = new ServerStyleSheet();
  try {
    const html = ReactDomServer.renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <Component/>
      </StyleSheetManager>
    );

    const styleTags = sheet.getStyleTags();

    return {
      html: sanitizeHtml(html, htmlSanitizeOptions),
      style: sanitizeHtml(styleTags, styleSanitizeOptions)
    };
  } catch (error) {
    console.error(error)
  } finally {
    sheet.seal()
  }
};

const styleWrapper = styles => `<style type="text/css">${styles}</style>`;

export default function templateRenderer({templateHtml, templates, styles}) {
  return templates.reduce((result, fileName) => {
    const Component = require(`./templates/${fileName}`).default;
    const {html, style} = render(Component);

    const templateFileName = `../rendered/${fileName.replace(/.(js|jsx|ts|tsx)$/, '.html')}`;
    const allStyles = [
      style,
      styleWrapper(styles)
    ];

    const templateFn = template(templateHtml);

    return {
      ...result,
      [templateFileName]: templateFn({
        title: '',
        content: html,
        styles: allStyles.join('\n')
      })
    }
  }, {});
}
