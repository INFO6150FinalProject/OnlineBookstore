import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const {
        user: { _id, name, email, role }
    } = isAuthenticated();

    const adminLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">Admin Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">
                            Create Category
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">
                            Create Product
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/orders">
                            View Orders
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const adminInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">Name: {name}</li>
                    <li className="list-group-item">Email: {email}</li>
                    <li className="list-group-item">Role: 
                         {role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Admin Dashboard"
            description=""
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{adminInfo()}</div>
                <div className="col-9">{adminLinks()}</div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
