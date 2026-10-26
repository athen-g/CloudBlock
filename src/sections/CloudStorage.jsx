import Section from '../components/Section'
import Callout from '../components/Callout'

export default function CloudStorage() {
  return (
    <Section id="cloud-storage" number="02" title="How Cloud Storage Handles Files">
      <p>
        Some cloud storage systems split files into blocks and replicate those blocks across
        machines. Hadoop Distributed File System (HDFS) is included here only as background.
      </p>
      <p>
        CloudBlock uses block splitting for local encryption. It is not HDFS or a distributed
        storage service, and it does not replicate files.
      </p>
      <p>
        CloudBlock splits files into 64 KiB blocks so each block can be encrypted and
        authenticated independently.
      </p>
      <Callout type="warning" label="Context">
        <p>
          HDFS is mentioned as background only. CloudBlock runs locally and does not replicate
          data or connect to a distributed file system.
        </p>
      </Callout>
    </Section>
  )
}
