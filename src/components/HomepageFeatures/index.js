import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'Fan-out & Aggregate',
        description: (
            <>
                Dispatch a single request to multiple upstreams in parallel and combine
                their responses — merge JSON objects, wrap into an array, or namespace
                by upstream name.
            </>
        ),
    },
    {
        title: 'Resilient by Default',
        description: (
            <>
                Per-upstream circuit breaker, configurable retry with backoff, and
                load balancing across multiple hosts — out of the box, via YAML.
                No code required.
            </>
        ),
    },
    {
        title: 'Extend with Plugins',
        description: (
            <>
                Hook into request and response phases using dynamic{" "}
                <code>.so</code> plugins or Lua scripts via{" "}
                <strong>Lumos</strong> — modify headers, validate tokens,
                or short-circuit responses.
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            {/*<div className="text--center">*/}
            {/*    <Svg className={styles.featureSvg} role="img"/>*/}
            {/*</div>*/}
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={clsx(styles.features, 'homepage-features')}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
