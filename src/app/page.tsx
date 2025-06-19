import UploadForm from "@/app/components/UploadForm";

// Diese Komponente wird jetzt extrem einfach. Sie muss nur noch das Formular rendern.
// Die umgebenden Container und die Animation werden vom Layout und Wrapper übernommen.
export default function Home() {
    return <UploadForm />;
}