import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import PrivateRoutes from "./PrivateRoutes";
import ProjectsPage from "../pages/ProjectsPage";
import Redirect from "./Redirect";
import Dashboard from "../pages/Dashboard";
import ProjectDetail from "../pages/ProjectDetail1";
import FilesManagement from "../pages/FilesManagement";


export default function AppRoutes () {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Redirect />} />
                <Route path={'/login'} element={<LoginPage/>}/>
                <Route element={<PrivateRoutes/>}>
                    <Route element={<Dashboard/>}>
                    <Route path={'/projects'} element={<ProjectsPage/>}/>
                     <Route path={"/projects/:id"} element={<ProjectDetail/>} />
                    <Route path="/projects/:id/files" element={<FilesManagement />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}