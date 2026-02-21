import { useParams } from "react-router";

const Visualizer = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>Visualizer: {id}</div>
    )
}


export default Visualizer;