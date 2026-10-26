import Section from '../components/Section'
import Callout from '../components/Callout'

export default function CloudStorage() {
  return (
    <Section id="cloud-storage" number="02" title="How Cloud Storage Handles Files">
      <p>
        Large-scale storage systems split large files into fixed-size chunks or blocks.
        This approach enables parallel processing across distributed compute nodes, efficient
        network transfers, and simplified replication across fault domains.
      </p>
      <p>
        The Hadoop Distributed File System (HDFS) is one example of a distributed storage
        architecture that uses block splitting and replication to manage petabytes of data.
        HDFS is referenced here as background context only. CloudBlock does not use HDFS,
        distributed storage, or replication.
      </p>
      <p>
        CloudBlock borrows the concept of fixed-size block splitting for a completely different
        purpose: to enable per-block encryption with unique nonces, ensuring each block is
        independently encrypted and authenticated.
      </p>
      <Callout type="warning" label="Context">
        <p>
          HDFS and distributed storage are mentioned as background only. CloudBlock is a local,
          single-machine tool — it does not replicate data or connect to any distributed file system.
        </p>
      </Callout>
    </Section>
  )
}
