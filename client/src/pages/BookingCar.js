import { Col, Row, Divider, DatePicker, Checkbox, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import { useNavigate } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

const { RangePicker } = DatePicker;

function BookingCar() {
  const carId = useLoaderData(); // carId from route
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setCar] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setDriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    } else {
      setCar(cars.find((o) => o._id === carId));
    }
  }, [cars]);

  useEffect(() => {
    let amount = totalHours * car.rentPerHour;
    if (driver) {
      amount += 30 * totalHours;
    }
    setTotalAmount(amount);
  }, [driver, totalHours, car.rentPerHour]);

  function selectTimeSlots(values) {
    setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
    setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));
    setTotalHours(values[1].diff(values[0], "hours"));
  }

  function handleBookNow() {
    // Redirect to the GPay page with the total amount, car name, and other details
    navigate("/gpay", { 
      state: { 
        totalAmount, 
        carId: car._id, 
        carName: car.name,  // Pass car name here
        bookedTimeSlots: car.bookedTimeSlots  // Optionally pass booked time slots
      }
    });
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center" className="d-flex align-items-center" style={{ minHeight: "90vh" }}>
        <Col lg={10} sm={24} xs={24} className="p-3">
          <img src={car.image} className="carimg2 bs1 w-100" data-aos="flip-left" data-aos-duration="1500" />
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal" dashed>Car Info</Divider>
          <div style={{ textAlign: "right" }}>
            <p>{car.name}</p>
            <p>{car.rentPerHour} Rent Per hour /-</p>
            <p>Fuel Type : {car.fuelType}</p>
            <p>Max Persons : {car.capacity}</p>
          </div>

          <Divider type="horizontal" dashed>Select Time Slots</Divider>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="MMM DD yyyy HH:mm"
            onChange={selectTimeSlots}
          />
          <br />
          <button className="btn1 mt-2" onClick={() => setShowModal(true)}>
            See Booked Slots
          </button>

          {from && to && (
            <div>
              <p>Total Hours : <b>{totalHours}</b></p>
              <p>Rent Per Hour : <b>{car.rentPerHour}</b></p>
              <Checkbox onChange={(e) => setDriver(e.target.checked)}>Driver Required</Checkbox>
              <h3>Total Amount : {totalAmount}</h3>
              <button className="btn1" onClick={handleBookNow}>Book Now</button>
            </div>
          )}
        </Col>

        {car.name && (
          <Modal visible={showModal} closable={false} footer={false} title="Booked time slots">
            <div className="p-2">
              {car.bookedTimeSlots.map((slot) => (
                <button className="btn1 mt-2" key={slot.from}>{slot.from} - {slot.to}</button>
              ))}
              <div className="text-right mt-5">
                <button className="btn1" onClick={() => setShowModal(false)}>CLOSE</button>
              </div>
            </div>
          </Modal>
        )}
      </Row>
    </DefaultLayout>
  );
}

export default BookingCar;
