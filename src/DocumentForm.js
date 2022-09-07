import React, { useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import uniqid from "uniqid";

const DocumentForm = () => {
  const [fields, setDields] = useState([
    { isRemoveable: false, fieldSetId: uniqid("fieldset-") },
  ]);

  const handleAddfield = () => {
    setDields((prev) => [
      ...prev,
      { isRemoveable: true, fieldSetId: uniqid("fieldset-") },
    ]);
  };

  const handleDeletefield = (id) => {
    setDields((prev) => prev.filter((item) => item.fieldSetId !== id));
  };

  return (
    <>
      <div className="document_form">
        <div className="document_form_wrapper">
          <Container>
            <Form>
              <Row className="gy-5">
                <Col xs={12} className="text-center">
                  <h2>Please fill all details given below</h2>
                </Col>
                <Col xs={12}>
                  <Row>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="firstName">
                        <Form.Label className="required_field">
                          <b>First Name</b>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Enter your first name here..."
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="lastName">
                        <Form.Label className="required_field">
                          <b>Last Name</b>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Enter your last name here..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="email">
                        <Form.Label className="required_field">
                          <b>E-mail</b>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="ex: myname@example.com"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="dateOfBirth">
                        <Form.Label className="required_field">
                          <b>Date of Birth</b>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          placeholder="Date of Birth"
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          (Min. age should be 18 years)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <p>
                      <b>Residential Address</b>
                    </p>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="street1">
                        <Form.Label className="required_field">
                          Street 1
                        </Form.Label>
                        <Form.Control type="text" name="street1" />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="street2">
                        <Form.Label className="required_field">
                          Street 2
                        </Form.Label>
                        <Form.Control type="text" name="street2" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group
                        className="mb-4"
                        controlId="residentialAddress"
                      >
                        <Form.Check
                          type="checkbox"
                          label="Same as Residential Address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <p>
                      <b>Permanent Address</b>
                    </p>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="street1">
                        <Form.Label>Street 1</Form.Label>
                        <Form.Control type="text" name="street1" />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-4" controlId="street2">
                        <Form.Label>Street 2</Form.Label>
                        <Form.Control type="text" name="street2" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <p>
                      <b>Upload Documents</b>
                    </p>
                    {fields.map(({ isRemoveable, fieldSetId }) => (
                      <Row className="align-items-center" key={fieldSetId}>
                        <Col xs={10}>
                          <Row>
                            <Col xs={12} lg={4}>
                              <Form.Group className="mb-4" controlId="fileName">
                                <Form.Label className="required_field">
                                  File Name
                                </Form.Label>
                                <Form.Control type="text" name="fileName" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} lg={4}>
                              <Form.Group className="mb-4" controlId="fileType">
                                <Form.Label className="required_field">
                                  File Type
                                </Form.Label>
                                <Form.Select aria-label="Default select example">
                                  <option value="">File type</option>
                                  <option value="image">Image</option>
                                  <option value="pdf">PDF</option>
                                </Form.Select>
                                <Form.Text className="text-muted">
                                  (Image, pdf.)
                                </Form.Text>
                              </Form.Group>
                            </Col>
                            <Col xs={12} lg={4}>
                              <Form.Group
                                className="mb-4"
                                controlId="uploadDocument"
                              >
                                <Form.Label className="required_field">
                                  Upload Document
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="uploadDocument"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={2}>
                          {!isRemoveable ? (
                            <button
                              type="button"
                              className="add_btn"
                              onClick={handleAddfield}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="remove_btn"
                              onClick={() => handleDeletefield(fieldSetId)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </Row>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default DocumentForm;
