import { TourService } from "@/types/tour-service"

export const targetType = {
    profilePic: 'Image',
    banner: 'BannerImage'
}
export const baseService: TourService = {
    serviceId: 0,
    serviceName: '',
    price: 0,
    duration: '',
    content: '',
    image: '',
    tourGuideId: 0,
    createdDate: '',
    isDeleted: false,
    title: '',
    tourDesc: ''
}