import { MilvusClient } from '@zilliz/milvus2-sdk-node';


async function listCollections(): Promise<boolean> {
    const client = new MilvusClient({
        address: '44.202.33.225:19530', // Replace with your EC2 Public IP
        token: 'root:Milvus'
    });

    try {
        const collections = await client.listCollections();
        console.log(collections);
        return true;
    } catch (error) {
        console.error('Error listing collections:', error);
        return false;
    }
}

export default async function MilvusStatus() {
    const status = await listCollections();

    return <p>
        Milvus: <span>
            {status ? "✅ Up!" : "❌ Not reachable!"}
        </span>
    </p>
}