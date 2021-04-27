import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class WorkflowConstant {
  private subject = new Subject<any>();
  public connectorType: any = ['Flowchart', { gap: 5, cornerRadius: 10 }];

  public connectorPaintStyle: any = {
    strokeWidth: 1,
    stroke: '#2061e9',
    joinstyle: 'round',
    outlineStroke: 'white',
    outlineWidth: 1
  };

  public connectorHoverStyle: any = {
    strokeWidth: 2,
    stroke: '#030b5c'
  };

  public endpointHoverStyle: any = {
    fill: 'white',
    stroke: '#030b5c'
  };

  public connectionParams = {
    connector: this.connectorType,
    paintStyle: {
      stroke: '#2929a5',
      fill: 'transparent',
      radius: 5,
      strokeWidth: 1
    },
    detachable: false,
    endpointStyle: { radius: 1 }
  };

  public rightEndpoint: any = {
    endpoint: 'Dot',
    paintStyle: {
      stroke: '#2929a5',
      fill: 'transparent',
      radius: 5,
      strokeWidth: 1
    },
    isSource: true,
    connector: this.connectorType,
    connectorStyle: this.connectorPaintStyle,
    hoverPaintStyle: this.endpointHoverStyle,
    connectorHoverStyle: this.connectorHoverStyle,
    maxConnections: 100,
    onMaxConnections(params, originalEvent) { },
    dragOptions: {},
    overlays: [
      [
        'Label',
        {
          location: [0.5, 1.5],
          label: 'Drag',
          visible: false
        }
      ]
    ],
    connectorOverlays: [
      [
        'Arrow',
        { width: 10, length: 10, location: 1, strokeWidth: 5, foldback: 1 }
      ],
      ['Custom', {
        create: (connection) => {
          const div = document.createElement('div');
          const node = document.createElement('i');
          div.setAttribute('class', 'del-icon');
          node.setAttribute('aria-hidden', 'true');
          node.setAttribute('class', 'fa fa-trash-o');
          node.addEventListener('click', () => {
            this.sendMessage('deleteCon', connection);
          });
          div.appendChild(node);
          return div;
        },
        location: 0.5,
        id: 'customOverlay'
      }]
    ],
    deleteEndpointsOnDetach: false,
    // cssClass: 'setDotPosition right'
  };

  public leftEndpoint: any = {
    endpoint: 'Dot',
    paintStyle: { fill: '#2929a5', radius: 5 },
    hoverPaintStyle: this.endpointHoverStyle,
    maxConnections: -1,
    dragOptions: { hoverClass: 'hover', activeClass: 'active' },
    isTarget: true,
    overlays: [['Label', { location: [0.5, -0.5], label: 'Drop', visible: false }]],
    deleteEndpointsOnDetach: false,
    // cssClass: 'setDotPosition left'
    onMaxConnections(params, originalEvent) { }
  };

  public anchorPositionRight: any = {
    anchor: 'Right'

  };

  public anchorPositionLeft: any = {
    anchor: 'Left'
  };

  public watermarkObjectList: any = [
    {
      step: '01',
      img: 'assets/images/workflows/select.png',
      title: 'Drag and drop node from left panel',
      description: 'Drag and drop node from left panel'
    },
    {
      step: '02',
      img: 'assets/images/workflows/configure.png',
      title: 'Connect, configure and design',
      description: 'Drag and connect addintional Trigger and Actions to enhance your data and configure it. '
    },
    {
      step: '03',
      img: 'assets/images/workflows/test-con.png',
      title: 'Test the connections',
      description: 'Test the connections used in the workflow and confirm.'
    },
    {
      step: '04',
      img: 'assets/images/workflows/execute.png',
      title: 'Execute',
      description: 'Save and execute your workflow'
    }
  ];

  sendMessage(message: string, connection?: any) {
    this.subject.next({ text: message, connection });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  public conditionEndpoint(label = 'Add Equation') {
    return {
      endpoint: 'Dot',
      paintStyle: {
        stroke: '#2929a5',
        fill: 'transparent',
        radius: 5,
        strokeWidth: 1
      },
      isSource: true,
      connector: this.connectorType,
      connectorStyle: this.connectorPaintStyle,
      hoverPaintStyle: this.endpointHoverStyle,
      connectorHoverStyle: this.connectorHoverStyle,
      maxConnections: 100,
      onMaxConnections(params, originalEvent) { },
      dragOptions: {},
      overlays: [
        [
          'Label',
          {
            location: [0.5, 1.5],
            label: 'Drag',
            visible: false
          }
        ]
      ],
      connectorOverlays: [
        [
          'Arrow',
          { width: 10, length: 10, location: 1, strokeWidth: 5, foldback: 1 }
        ],
        ['Label', {
          label, id: 'equation', location: 0.8, cssClass: 'myLabel',
          events: {
            click: (labelOverlay, originalEvent) => {
              this.sendMessage('showLabel', { label: labelOverlay, pos: originalEvent });
              this.sendMessage('showConnectionNode', { sourceID: labelOverlay.component.sourceId, targetID: labelOverlay.component.targetId });
            }
          }
        }
        ],
        ['Custom', {
          create: (connection) => {
            const div = document.createElement('div');
            const node = document.createElement('i');
            div.setAttribute('class', 'del-icon');
            node.setAttribute('aria-hidden', 'true');
            node.setAttribute('class', 'fa fa-trash-o');
            node.addEventListener('click', () => {
              this.sendMessage('deleteCon', connection);
            });
            div.appendChild(node);
            return div;
          },
          location: 0.5,
          id: 'customOverlay'
        }]
      ],
      deleteEndpointsOnDetach: false
    }
    // cssClass: 'setDotPosition right'
  }
}
