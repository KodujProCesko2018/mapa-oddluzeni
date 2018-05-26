import { Provider } from 'react-redux'
import store from '../redux/store'

const Layout = ({ children }) => (
    <Provider store={store}>
        {children}
    </Provider>
)

export default Layout
