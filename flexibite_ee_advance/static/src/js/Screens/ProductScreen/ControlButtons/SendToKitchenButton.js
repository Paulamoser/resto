odoo.define('flexibite_ee_advance.SendToKitchenButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    class SendToKitchenButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }
        async onClick(){
            var selectedOrder = this.env.pos.get_order();
            selectedOrder.initialize_validation_date();
            if(selectedOrder.is_empty()){
                return alert ('Please select product!!');
            }else{
                await this.env.pos.get_order().set_delete_product(false)
                this.env.pos.sync_from_server(this.env.pos.table, this.env.pos.get_order_list(), this.env.pos.get_order_with_uid());
            }
        }
    }
    SendToKitchenButton.template = 'SendToKitchenButton';

    ProductScreen.addControlButton({
        component: SendToKitchenButton,
        condition: function() {
            return this.env.pos.user.kitchen_screen_user === 'manager' &&
                   this.env.pos.restaurant_mode == 'full_service';
        },
    });

    Registries.Component.add(SendToKitchenButton);

    return SendToKitchenButton;
});
