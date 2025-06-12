"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './AddProject.css';
import Footer from '@/components/Footer/Footer';
import NavBar from '@/components/navbar_client/Navbar';

const AddProject = () => {
  const router = useRouter();
  const token = localStorage.getItem('token');
  const [project, setProject] = useState({
    projectName: '',
    budgetMin: '',
    budgetMax: '',
    endDate: '',
    description: '',
    skillsRequired: ['']
  });
  const removeItem = (type, indexToRemove) => {
    setProject(prev => ({
      ...prev,
      [type]: prev[type].filter((_, index) => index !== indexToRemove)
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    setProject(prev => ({
      ...prev,
      endDate: e.target.value
    }));
  };

  const handleArrayChange = (type, index, value) => {
    setProject(prev => {
      const newArray = [...prev[type]];
      newArray[index] = value;
      return {
        ...prev,
        [type]: newArray
      };
    });
  };

  const addItem = (type) => {
    setProject(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedProject = {
      name: project.projectName,
      minBudget: parseFloat(project.budgetMin),
      maxBudget: parseFloat(project.budgetMax),
      bindingDeadline: project.endDate + "T00:00:00",
      description: project.description,
      requiredSkills: project.skillsRequired.filter(skill => skill.trim() !== ''),
    };

    try {
      console.log({ token });
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedProject),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      router.push("/client/MyProjects");
    } catch (error) {
    }
  };


  return (
    <div>
      <NavBar />
      <div className="add-project-container">
        <h1 className="add-project-title">Add a Project</h1>

        <form onSubmit={handleSubmit} className="add-project-form">
          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={project.projectName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group budget-group">
            <label>Budget</label>
            <div className="budget-inputs">
              <div className="budget-field">
                <span className="budget-label">Min:</span>
                <div className="budget-input-wrapper">
                  <input
                    type="number"
                    name="budgetMin"
                    value={project.budgetMin}
                    onChange={handleChange}
                  />
                  <span className="currency">MAD</span>
                </div>
              </div>

              <div className="budget-field">
                <span className="budget-label">Max:</span>
                <div className="budget-input-wrapper">
                  <input
                    type="number"
                    name="budgetMax"
                    value={project.budgetMax}
                    onChange={handleChange}
                  />
                  <span className="currency">MAD</span>
                </div>
              </div>
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="endDate">End Date of Binding</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={project.endDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              minLength={100}
              rows={5}
            ></textarea>
            <div className="character-count">
              <span>min. 100 characters</span>
              <span>{project.description.length}/700</span>
            </div>
          </div>


          <div className="form-group">
            <label>Skills Required</label>
            <div className="skills-list">
              {project.skillsRequired.map((skill, index) => (
                <div key={`skill-${index}`} className="skill-item">
                  <input
                    type="text"
                    value={skill}
                    placeholder={`Skill ${index + 1}`}
                    onChange={(e) =>
                      handleArrayChange("skillsRequired", index, e.target.value)
                    }
                  />
                  {/* Show remove button only if skill is not empty */}
                  {skill.trim() !== "" && (
                    <button
                      type="button"
                      className="remove-skill-btn"
                      onClick={() => removeItem("skillsRequired", index)}
                      aria-label="Remove skill"
                    >
                      −
                    </button>
                  )}
                  {/* Show add button only on last skill input */}
                  {index === project.skillsRequired.length - 1 && (
                    <button
                      type="button"
                      className="add-skill-btn"
                      onClick={() => addItem("skillsRequired")}
                      aria-label="Add skill"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>



          <div className="submit-container">
            <button type="submit" className="submit-button">Add</button>
          </div>
        </form>
      </div>
      <div style={{ backgroundColor: "#2f3c7e", marginTop: "50px" }}>
        <Footer />
      </div>
    </div>

  );
};

export default AddProject;