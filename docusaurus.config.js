// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Route. Aggregate. Extend.',
    tagline: 'Kono is a lightweight API Gateway in Go — parallel fan-out, flexible aggregation, and zero configuration magic.',
    favicon: 'img/rabbit-origami-paper.svg',

    future: {
        v4: true,
    },

    url: 'https://your-docusaurus-site.example.com',
    baseUrl: '/konodocs',

    organizationName: 'starwalkn',
    projectName: 'konodocs',
    trailingSlash: false,

    onBrokenLinks: 'throw',

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: './sidebars.js',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            image: 'img/docusaurus-social-card.jpg',
            colorMode: {
                defaultMode: 'light',
                disableSwitch: true,
                respectPrefersColorScheme: false,
            },
            announcementBar: {
                id: 'contributors',
                content: 'We are looking for active contributors',
                backgroundColor: '#1A6FD4',
                textColor: '#F0F4F8',
                isCloseable: true,
            },
            navbar: {
                title: 'Kono',
                logo: {
                    alt: 'Rabbit Origami Paper',
                    src: 'img/rabbit-origami-paper.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        label: 'Documentation',
                        sidebarId: 'docsSidebar',
                        position: 'left',
                    },
                    {
                        href: 'https://github.com/starwalkn/kono/discussions',
                        label: 'Help',
                        position: 'left',
                    },
                    {
                        type: 'docsVersionDropdown',
                        position: 'right',
                    },
                    {
                        href: 'https://github.com/starwalkn/kono',
                        className: 'header-github-link',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                logo: {
                    alt: 'Rabbit Origami Paper',
                    src: 'img/rabbit-origami-paper.svg',
                    width: 70,
                    height: 70,
                    href: 'https://github.com/starwalkn/kono',
                },
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {label: 'Introduction',   to: '/docs/intro'},
                            {label: 'Getting Started', to: '/docs/getting-started'},
                            {label: 'Configuration',  to: '/docs/configuration'},
                            {label: 'Metrics',        to: '/docs/metrics'},
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'GitHub Discussions',
                                href: 'https://github.com/starwalkn/kono/discussions',
                            },
                            {
                                label: 'GitHub Issues',
                                href: 'https://github.com/starwalkn/kono/issues',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/starwalkn/kono',
                            },
                            {
                                label: 'Releases',
                                href: 'https://github.com/starwalkn/kono/releases',
                            },
                            {
                                label: 'pkg.go.dev',
                                href: 'https://pkg.go.dev/github.com/starwalkn/kono',
                            },
                            {
                                label: 'Docker Hub',
                                href: 'https://hub.docker.com/r/starwalkn/kono',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Alexander Pikeev.<br/>Built with Docusaurus.`,
            },
            prism: {
                theme: prismThemes.nightOwlLight,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ['bash'],
            },
        }),
    plugins: [
        [
            '@easyops-cn/docusaurus-search-local',
            {
                hashed: true,
                language: 'en',
                highlightSearchTermsOnTargetPage: true,
                explicitSearchResultPath: true,
            },
        ],
    ],
};

export default config;