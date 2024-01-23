import { Helmet } from "react-helmet";

interface IMetadataProps {
	title: string;
	description: string;
}

export const Metadata: React.FC<IMetadataProps> = ({ title, description }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
		</Helmet>
	);
};
