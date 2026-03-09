import { adminDoctors } from "./adminDoctorData";
import { adminInstitutions } from "./adminInstitutionData";
import { adminOrders, adminDisputes } from "./adminOrderData";
import type { AdminOrder } from "./adminOrderData";

export const getInstitutionById = (id: string) => adminInstitutions.find((item) => item.id === id);
export const getDoctorById = (id: string) => adminDoctors.find((item) => item.id === id);
export const getOrderById = (id: string) => adminOrders.find((item) => item.id === id);

export const getOrdersByUserId = (userId: string): AdminOrder[] =>
  adminOrders.filter((item) => item.userId === userId);

export const getOrdersByInstitutionId = (institutionId: string): AdminOrder[] =>
  adminOrders.filter((item) => item.institutionId === institutionId);

export const getOrdersByDoctorId = (doctorId: string): AdminOrder[] =>
  adminOrders.filter((item) => item.doctorId === doctorId);

export const getDisputeByOrderId = (orderId: string) =>
  adminDisputes.find((item) => item.orderId === orderId);

export const getDisputesByInstitutionId = (institutionId: string) =>
  adminDisputes.filter((dispute) => {
    const order = getOrderById(dispute.orderId);
    return order?.institutionId === institutionId;
  });
