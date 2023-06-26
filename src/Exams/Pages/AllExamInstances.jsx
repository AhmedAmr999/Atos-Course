import React, { useState, useEffect } from "react";
import Card from "../../Shared/Components/Card";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import {
  getAllExamInstances,
  getUserExamInstances,
} from "../../Shared/APIS/ExamsInstanceAPI";
const AllExamInstances = () => {
  const [examInstances, setExamInstances] = useState([]);
  const [examDefinitionNames, setExamDefinitionNames] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getInstances();
  }, []);

  const getInstances = async () => {
    try {
      const data = await getAllExamInstances();
      setExamInstances(data);
      fetchExamDefinitionNames(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExamDefinitionNames = async (instances) => {
    const names = {};
    for (const instance of instances) {
      try {
        const data = await getUserExamInstances(
          userId,
          instance.examdefinition_id
        );
        names[instance.examinstance_id] = data.examDefinitionName;
      } catch (error) {
        console.error(error);
        names[instance.examinstance_id] = "";
      }
    }
    setExamDefinitionNames(names);
  };

  return (
    <React.Fragment>
      <div className="">
        {examInstances.length === 0 ? (
          <Card className="card">
            <div>
              <h1 className="no-exam-message">No Exam Instances available</h1>
            </div>
          </Card>
        ) : (
          <>
            <h1 className="title">All Exam Instances</h1>
            {examInstances.map((instance) => (
              <Card className="card" key={instance.examinstance_id}>
                <div>
                  <h1 className="exam-name">
                    {examDefinitionNames[instance.examinstance_id]}
                  </h1>
                  <p className="started-time">
                    Started Time: {instance.startedtime}
                  </p>
                  <NavLink
                    className="view-link"
                    to={`/examInstances/${instance.examinstance_id}`}
                  >
                    View Exam Instance
                  </NavLink>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default AllExamInstances;
