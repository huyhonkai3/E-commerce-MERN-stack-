// HOC để inject các hook của React Router vào class-component
// using withRouter in class-component
import { useParams, useNavigate } from "react-router-dom"; // Đã sửa khoảng trắng trong tên package

function withRouter(Component) {
    // Trả về một functional component mới bao bọc component gốc
    return (props) => {
        // Gọi các hook bên trong functional component
        const params = useParams();
        const navigate = useNavigate();
        // Render component gốc và truyền các props cùng với params và navigate
        return (
            <Component
                {...props} // Truyền tất cả props gốc
                params={params} // Truyền kết quả của useParams()
                navigate={navigate} // Truyền kết quả của useNavigate()
            />
        );
    };
}

export default withRouter;