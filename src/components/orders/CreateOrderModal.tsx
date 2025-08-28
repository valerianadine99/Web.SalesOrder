// Modal para crear una nueva orden

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '@/components/ui';
import { useOrderStore } from '@/store/orderStore';
import { CreateOrderCommand, CreateOrderDetailDto } from '@/types/api';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const orderDetailSchema = z.object({
  productName: z.string().min(1, 'El nombre del producto es requerido'),
  productCode: z.string().min(1, 'El código del producto es requerido'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  unitPrice: z.number().min(0.01, 'El precio debe ser mayor a 0'),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerEmail: z.string().email('Email inválido'),
  orderDate: z.string().min(1, 'La fecha de la orden es requerida'),
  orderDetails: z.array(orderDetailSchema).min(1, 'Debe tener al menos un producto'),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const { createOrder, isLoading } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      orderDetails: [{ productName: '', productCode: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderDetails',
  });

  const orderDetails = watch('orderDetails');

  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateTotal = () => {
    return orderDetails.reduce((total, detail) => {
      return total + calculateSubtotal(detail.quantity || 0, detail.unitPrice || 0);
    }, 0);
  };

  const onSubmit = async (data: CreateOrderFormData) => {
    setIsSubmitting(true);
    try {
      await createOrder(data);
      toast('Orden creada exitosamente', { icon: '✅' });
      reset();
      onClose();
    } catch (error) {
      toast('Error al crear la orden', { icon: '❌' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProduct = () => {
    append({ productName: '', productCode: '', quantity: 1, unitPrice: 0 });
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Crear Nueva Orden
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Cliente"
              placeholder="Nombre completo del cliente"
              error={errors.customerName?.message}
              {...register('customerName')}
            />
            <Input
              label="Email del Cliente"
              type="email"
              placeholder="cliente@email.com"
              error={errors.customerEmail?.message}
              {...register('customerEmail')}
            />
          </div>

          <Input
            label="Fecha de la Orden"
            type="date"
            error={errors.orderDate?.message}
            {...register('orderDate')}
          />

          {/* Productos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-secondary-900">
                Productos de la Orden
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProduct}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Producto
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border border-secondary-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-secondary-700">
                    Producto {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-danger-500 hover:text-danger-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre del Producto"
                    placeholder="Nombre del producto"
                    error={errors.orderDetails?.[index]?.productName?.message}
                    {...register(`orderDetails.${index}.productName`)}
                  />
                  <Input
                    label="Código del Producto"
                    placeholder="Código único"
                    error={errors.orderDetails?.[index]?.productCode?.message}
                    {...register(`orderDetails.${index}.productCode`)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Cantidad"
                    type="number"
                    min="1"
                    placeholder="1"
                    error={errors.orderDetails?.[index]?.quantity?.message}
                    {...register(`orderDetails.${index}.quantity`, { valueAsNumber: true })}
                  />
                  <Input
                    label="Precio Unitario"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    error={errors.orderDetails?.[index]?.unitPrice?.message}
                    {...register(`orderDetails.${index}.unitPrice`, { valueAsNumber: true })}
                  />
                </div>

                <div className="text-right">
                  <span className="text-sm text-secondary-600">
                    Subtotal: ${calculateSubtotal(
                      orderDetails[index]?.quantity || 0,
                      orderDetails[index]?.unitPrice || 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {errors.orderDetails && (
              <p className="text-sm text-danger-600">{errors.orderDetails.message}</p>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-secondary-200 pt-4">
            <div className="text-right">
              <span className="text-lg font-semibold text-secondary-900">
                Total: ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando Orden...' : 'Crear Orden'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
