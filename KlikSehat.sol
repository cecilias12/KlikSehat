// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KlikSehat {
    struct Doctor {
        address wallet;
        string name;
        string specialization;
        uint consultationFee;
        bool active;
    }

    struct Consultation {
        address patient;
        address doctor;
        uint timestamp;
        string status;
    }

    mapping(address => Doctor) public doctors;
    Consultation[] public consultations;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function registerDoctor(
        address _wallet,
        string memory _name,
        string memory _specialization,
        uint _consultationFee
    ) public onlyOwner {
        require(!doctors[_wallet].active, "Doctor already registered");
        doctors[_wallet] = Doctor(_wallet, _name, _specialization, _consultationFee, true);
    }

    function deactivateDoctor(address _wallet) public onlyOwner {
        require(doctors[_wallet].active, "Doctor not found");
        doctors[_wallet].active = false;
    }

    function bookConsultation(address _doctor) public payable {
        Doctor memory doctor = doctors[_doctor];
        require(doctor.active, "Doctor is not available");
        require(msg.value == doctor.consultationFee, "Incorrect fee sent");

        consultations.push(Consultation(msg.sender, _doctor, block.timestamp, "Pending"));

        payable(_doctor).transfer(msg.value);
    }

    function getConsultations() public view returns (Consultation[] memory) {
        return consultations;
    }
}