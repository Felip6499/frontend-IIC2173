import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';

function Routing() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Main />} />
			</Routes>
		</BrowserRouter>
	);
}

export default Routing;
