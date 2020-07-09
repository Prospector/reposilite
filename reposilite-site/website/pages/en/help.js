/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `Learn more using the [guide on this site.](${docUrl(
        'about',
      )})`,
      title: 'Browse Guide 🔎',
    },
    {
      content: "Find out what's new with this project and remember to use the latest version of Reposilite",
      title: 'Stay up to date',
    },
    {
      content:
        'Ask questions about the documentation and project in [Reposilite Issues](https://github.com/dzikoysk/reposilite/issues)',
      title: 'Visit Issues',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <p>
            This project is maintained mainly by 
            <a href="https://github.com/dzikoysk"> @dzikoysk</a>. 
            To support this project, visit 
            <a href="https://panda-lang.org/support/">support</a> 
            page, leave a star or contribute. If you are looking for help, search here:
          </p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
