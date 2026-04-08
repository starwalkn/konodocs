import clsx from 'clsx';
import styles from './styles.module.css';
import {Highlight} from 'prism-react-renderer';

const features = [
    {
        title: <>Fan-out & <span className={styles.gradientWord}>Aggregate</span></>,
        description: 'Dispatch a single request to multiple upstreams in parallel and combine their responses — merge JSON objects, wrap into an array, or namespace by upstream name.',
        code: `flows:
  - path: /api/summary
    upstreams:
      - url: http://users:8081
      - url: http://orders:8082
    aggregation: merge
    best_effort: true
      on_conflict:
        policy: prefer
        prefer_upstream: users`,
    },
    {
        title: <><span className={styles.gradientWord}>Resilient</span> by Default</>,
        description: 'Per-upstream circuit breaker, configurable retry with backoff, and load balancing across multiple hosts — out of the box, via YAML. No code required.',
        code: `policy:
  retry:
    attempts: 3
    backoff: exponential
  circuit_breaker:
    threshold: 0.5
    timeout: 10s
  load_balancer:
    strategy: round_robin`,
        reverse: true,
    },
    {
        title: <>Extend with <span className={styles.gradientWord}>Plugins</span></>,
        description: 'Hook into request and response phases using dynamic .so plugins — modify headers, transform responses, validate tokens, or short-circuit requests.',
        code: `package main

import "github.com/starwalkn/kono/sdk"

type Plugin struct{}

func (p *Plugin) Info() sdk.PluginInfo {
    return sdk.PluginInfo{
        Name:    "snakeify",
        Version: "v1",
        Author:  "starwalkn",
    }
}

func (p *Plugin) Type() sdk.PluginType {
    return sdk.PluginTypeResponse
}

func (p *Plugin) Execute(ctx sdk.Context) error {
    // transform response JSON keys
    // to snake_case
    return snakeify(ctx.Response())
}`,
    },
];

const terminalTheme = {
    plain: {color: '#aacef0', backgroundColor: '#0F2A4A'},
    styles: [
        {types: ['keyword', 'builtin'], style: {color: '#5AA3DE'}},
        {types: ['string', 'char'], style: {color: '#9dd8f7'}},
        {types: ['function', 'method'], style: {color: '#c8ddef'}},
        {types: ['comment'], style: {color: '#5a7a9a', fontStyle: 'italic'}},
        {types: ['operator', 'punctuation'], style: {color: '#7a9ab8'}},
        {types: ['class-name', 'type'], style: {color: '#74B8EE'}},
        {types: ['number', 'boolean'], style: {color: '#29a1eb'}},
        {types: ['property'], style: {color: '#aacef0'}},
    ],
};

function Terminal({code, language = 'go'}) {
    return (
        <div className={styles.terminal}>
            <div className={styles.terminalDots}>
                <span/><span/><span/>
            </div>
            <Highlight code={code.trim()} language={language} theme={terminalTheme}>
                {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={clsx(styles.terminalCode, className)} style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({line})}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({token})} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}

function Feature({title, description, code, reverse}) {
    return (
        <div className={clsx(styles.featureRow, reverse && styles.featureRowReverse)}>
            <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{description}</p>
            </div>
            <Terminal code={code}/>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={clsx(styles.features, 'homepage-features')}>
            <div className="container">
                {features.map((props, idx) => (
                    <Feature key={idx} {...props} />
                ))}
            </div>
        </section>
    );
}