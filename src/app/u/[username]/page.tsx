'use client'

import { useParams, useSearchParams } from "next/navigation";

function PublicProfilePage() {

    const params = useParams();
    console.log(params);
    const searchParams = useSearchParams();
    console.log(searchParams.get('id'));
    
    

    return <div>
        Public Profile Page
    </div>
}

export default PublicProfilePage;