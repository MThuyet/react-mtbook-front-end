import { useCurrentApp } from "components/context/app.context";


const AppHeader = () => {
	const { user } = useCurrentApp();
	return (
		<div>
			App Header
			<div>{JSON.stringify(user)}</div>
		</div>
	)
}

export default AppHeader;
