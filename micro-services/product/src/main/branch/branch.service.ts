import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from 'src/entity/branch.entity';
import { BranchRepository } from './branch.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class BranchService {
  constructor(private readonly branchRepo: BranchRepository) {}

  // create query and exception handling
  async create(body) {
    try {
      const { name } = body;
      const checkName = await this.validateName(name);
      if (checkName) {
        throw new BadRequestException('PRODUCT_E0014');
      }

      const polygon = await this.getPolygonByRadius(body.radius, 10, [
        body.lat,
        body.long,
      ]);

      const reversePolygon = polygon.map((_point: [number]) =>
        _point.reverse(),
      );
      body.deliveryArea = {
        type: 'Polygon',
        coordinates: [[...reversePolygon, reversePolygon[0]]],
      };
      body.location = { type: 'Point', coordinates: [body.long, body.lat] };
      const data = await this.branchRepo.create(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by branch id query and exception handling
  async findById(id) {
    try {
      const branchIds = id?.split(',');
      for (let i = 0; i < branchIds.length; i++) {
        await this.validateId(branchIds[i]);
      }
      const data = await this.branchRepo.findById(branchIds);
      const newData = data.map((data) => {
        const deliveryArea = data.deliveryArea.coordinates[0].map(
          (_point: [number]) => _point.reverse(),
        );
        data.deliveryArea.coordinates = deliveryArea;
        data.location.coordinates = data.location.coordinates.reverse();
        return data;
      });
      return { body: newData, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all branches and exception handling
  async getAllBranches(id, role, query) {
    try {
      if (
        role.includes('SuperAdmin') ||
        role.includes('Admin') ||
        role.includes('BranchManagement')
      ) {
        query.adminId = id;
      }
      const branches = await this.branchRepo.getAllBranches(query);
      const newData = branches.data.map((data) => {
        const deliveryArea = data.deliveryArea.coordinates[0].map(
          (_point: [number]) => _point.reverse(),
        );
        data.deliveryArea.coordinates = deliveryArea;
        data.location.coordinates = data.location.coordinates.reverse();
        return data;
      });
      branches.data = newData;
      return { body: branches, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by branch id query and exception handling
  async updateBranchById(id: string, body) {
    try {
      await this.validateId(id);
      const { name } = body;
      const checkName = await this.validateName(name);
      if (checkName) {
        throw new BadRequestException('PRODUCT_E0014');
      }
      if (body?.deliveryArea?.length > 0) {
        const reversePolygon = body?.deliveryArea?.map((_point: [number]) =>
          _point.reverse(),
        );
        body.deliveryArea = {
          type: 'Polygon',
          coordinates: [[...reversePolygon, reversePolygon[0]]],
        };
      }
      if (body?.location?.length > 0) {
        body.location = {
          type: 'Point',
          coordinates: body.location.reverse(),
        };
      }
      const data = await this.branchRepo.updateBranchById(id, { ...body });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by branch id query and exception handling
  async updateBranchTiming(id: string, body) {
    try {
      await this.validateId(id);
      const data = await this.branchRepo.updateBranchTiming(id, { ...body });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by branch id query and exception handling
  async deleteBranchById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.branchRepo.deleteBranchById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates branch id
  async validateId(id) {
    const checkId = await this.branchRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }

  // validates branch Name
  async validateName(name) {
    const checkName = await this.branchRepo.findByName(name);
    if (name && checkName) {
      return true;
    } else {
      return false;
    }
  }

  // saga utils

  // saga query method of service for nested object initialization
  async adminFindUsingQuery(operatorData) {
    const branchData = await this.branchRepo.findUsingQuery();
    if (branchData.length <= 0) {
      return { data: [], count: 0 };
    }
    return {
      count: operatorData.count,
      data: await operatorData.data.map((operator) => {
        branchData.forEach((branch) => {
          if (operator.branchIds.includes(branch._id.toString())) {
            operator.city = branch.city;
            operator.region = branch.region;
          }
        });
        return operator;
      }),
    };
  }

  // saga query method of service for nested object initialization
  async riderFindUsingQuery(riderGroupByData) {
    const branchData = await this.branchRepo.findUsingQuery();
    if (branchData.length <= 0) {
      return { data: [], count: 0 };
    }
    return {
      count: riderGroupByData.count,
      data: await riderGroupByData.map((rider) => {
        branchData.forEach((branch) => {
          if (rider.branchid === branch._id.toString()) {
            rider.branchName = branch.name;
            rider.branchId = rider.branchid;
            delete rider.branchid;
          }
        });
        return rider;
      }),
    };
  }

  // saga query method of service for nested object initialization
  async adminFindAllBranchIds() {
    return this.branchRepo.adminFindAllBranchIds();
  }

  async getPolygonByRadius(radius, numPoints, centerPoint) {
    var points = [];
    var earthRadiusKm = 6371;
    var angle = (2 * Math.PI) / numPoints; // Calculate the angle between each point

    for (var i = 0; i < numPoints; i++) {
      var x =
        centerPoint[0] + (radius / earthRadiusKm) * 10 * Math.cos(i * angle); // Calculate the x-coordinate
      var y =
        centerPoint[1] + (radius / earthRadiusKm) * 10 * Math.sin(i * angle); // Calculate the y-coordinate
      points.push([x, y]);
    }

    return points;
  }
}
